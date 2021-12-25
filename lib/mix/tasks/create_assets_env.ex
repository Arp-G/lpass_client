defmodule Mix.Tasks.CreateAssetsEnv do
  @moduledoc "Generates a .env file to be used by the react pwa"
  @shortdoc "Generates a .env file to be used by the react pwa"

  use Mix.Task

  @envs ["USERNAME", "API_URL"]

  @impl Mix.Task
  def run(_args) do
    content =
      Enum.reduce(
        @envs,
        "",
        fn env, acc ->
          "#{acc}#{env} = '#{System.get_env(env)}'\n"
        end
      )

    File.write("assets/.env", content, [])
  end
end
