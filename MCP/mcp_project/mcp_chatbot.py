from dotenv import load_dotenv
from openai import OpenAI
from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client
from typing import List
import asyncio, os, json
import nest_asyncio

nest_asyncio.apply()

load_dotenv()


class MCP_ChatBot:
    def __init__(self):
        # Initialize session and client objects
        self.session: ClientSession = None
        self.openai = OpenAI(
            # 若没有配置环境变量，请用百炼API Key将下行替换为：api_key="sk-xxx",
            api_key=os.getenv("DASHSCOPE_API_KEY"),
            base_url="https://dashscope.aliyuncs.com/compatible-mode/v1",
        )
        self.available_tools: List[dict] = []

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

                # Call a tool
                # result = execute_tool(tool_name, tool_args): not anymore needed
                # tool invocation through the client session
                result = await self.session.call_tool(tool_name, arguments=tool_args)

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

    async def connect_to_server_and_run(self):
        # Create server parameters for stdio connection
        server_params = StdioServerParameters(
            command="uv",  # Executable
            args=["run", "research_server.py"],  # Optional command line arguments
            env=None,  # Optional environment variables
        )
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                self.session = session
                # Initialize the connection
                await session.initialize()

                # List available tools
                response = await session.list_tools()

                tools = response.tools
                print("\nConnected to server with tools:", [tool.name for tool in tools])

                self.available_tools = [{
                    "type": "function",
                    "function": {
                        "name": tool.name,
                        "description": tool.description,
                        "parameters": tool.inputSchema
                    }
                } for tool in response.tools]

                await self.chat_loop()


async def main():
    chatbot = MCP_ChatBot()
    await chatbot.connect_to_server_and_run()


if __name__ == "__main__":
    asyncio.run(main())
