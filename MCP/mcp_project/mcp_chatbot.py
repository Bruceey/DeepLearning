from dotenv import load_dotenv
from openai import OpenAI
from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client
from typing import List, Dict, TypedDict
from contextlib import AsyncExitStack
import json
import asyncio, os

load_dotenv()


class MCP_ChatBot:

    def __init__(self):
        # Initialize session and client objects
        self.sessions: List[ClientSession] = []  # new
        self.exit_stack = AsyncExitStack()  # new
        self.anthropic = self.openai = OpenAI(
            # 若没有配置环境变量，请用百炼API Key将下行替换为：api_key="sk-xxx",
            api_key=os.getenv("DASHSCOPE_API_KEY"),
            base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
        )
        self.available_tools = []  # new
        self.tool_to_session: Dict[str, ClientSession] = {}  # new

    async def connect_to_server(self, server_name: str, server_config: dict) -> None:
        """Connect to a single MCP server."""
        try:
            server_params = StdioServerParameters(**server_config)
            stdio_transport = await self.exit_stack.enter_async_context(
                stdio_client(server_params)
            )  # new
            read, write = stdio_transport
            session = await self.exit_stack.enter_async_context(
                ClientSession(read, write)
            )  # new
            await session.initialize()
            self.sessions.append(session)

            # List available tools for this session
            response = await session.list_tools()
            tools = response.tools
            print(f"\nConnected to {server_name} with tools:", [t.name for t in tools])

            for tool in tools:  # new
                self.tool_to_session[tool.name] = session
                self.available_tools.append({
                    "type": "function",
                    "function": {
                        "name": tool.name,
                        "description": tool.description,
                        "parameters": tool.inputSchema
                    }
                })
        except Exception as e:
            print(f"Failed to connect to {server_name}: {e}")

    async def connect_to_servers(self):  # new
        """Connect to all configured MCP servers."""
        try:
            with open("server_config.json", "r") as file:
                data = json.load(file)

            servers = data.get("mcpServers", {})

            for server_name, server_config in servers.items():
                await self.connect_to_server(server_name, server_config)
        except Exception as e:
            print(f"Error loading server configuration: {e}")
            raise

    def function_calling(self, messages):
        completion = self.openai.chat.completions.create(
            max_tokens=2024,
            model="qwen-plus",
            messages=messages,
            tools=self.available_tools
        )
        return completion

    async def process_query(self, query):
        messages = [{'role': 'user', 'content': query}]

        process_query = True
        while process_query:
            completion = self.function_calling(messages)
            if completion.choices[0].message.content:
                print(completion.choices[0].message.content)
                process_query = False

            elif len(completion.choices[0].message.tool_calls) > 0:
                print(completion.choices[0].message)
                tool_calls = completion.choices[0].message.tool_calls
                tool_name = tool_calls[0].function.name
                tool_args = tool_calls[0].function.arguments
                tool_args = json.loads(tool_args)
                print(f"Calling tool {tool_name} with args {tool_args}")

                # 1) 直接调用代码，不作为服务器，Call a tool
                # result = execute_tool(tool_name, tool_args)
                # 2) 一对一，tool invocation through the client session
                # result = await self.session.call_tool(tool_name, arguments=tool_args)
                # 3) 多对多
                session = self.tool_to_session[tool_name]  # new
                result = await session.call_tool(tool_name, arguments=tool_args)

                messages.append(completion.choices[0].message)
                messages.append({'role': 'tool', 'content': result.content, 'tool_call_id': tool_calls[0].id})

    async def chat_loop(self):
        """Run an interactive chat loop"""
        print("\nMCP Chatbot Started!")
        print("Type your queries or 'quit' to exit.")

        while True:
            try:
                query = input("\nQuery: ").strip()

                if query.lower() == 'quit':
                    break

                await self.process_query(query)
                print("\n")

            except Exception as e:
                print(f"\nError: {str(e)}")

    async def cleanup(self):  # new
        """Cleanly close all resources using AsyncExitStack."""
        await self.exit_stack.aclose()


async def main():
    chatbot = MCP_ChatBot()
    try:
        # the mcp clients and sessions are not initialized using "with"
        # like in the previous lesson
        # so the cleanup should be manually handled
        await chatbot.connect_to_servers()  # new!
        await chatbot.chat_loop()
    finally:
        await chatbot.cleanup()  # new!


if __name__ == "__main__":
    asyncio.run(main())
