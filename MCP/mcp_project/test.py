from dotenv import load_dotenv
from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client
from typing import List
import asyncio
import nest_asyncio


async def connect_to_server_and_run():
    server_params = StdioServerParameters(
        command="uv",  # Executable
        args=["run", "research_server.py"],  # Optional command line arguments
        env=None,  # Optional environment variables
    )
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            # Initialize the connection
            await session.initialize()

            # List available tools
            response = await session.list_tools()

            tools = response.tools
            print("\nConnected to server with tools:", [tool.name for tool in tools])

            available_tools = [{
                "name": tool.name,
                "description": tool.description,
                "input_schema": tool.inputSchema
            } for tool in response.tools]

asyncio.run(connect_to_server_and_run())