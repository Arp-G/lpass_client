defmodule Mix.Tasks.CreateAssetsEnv do
  @moduledoc "Generates a .env file to be used by the react pwa"
  @shortdoc "Generates a .env file to be used by the react pwa"

  use Mix.Task

  @envs ["USERNAME", "API_URL"]

  @impl Mix.Task
  def run(_args) do
    Mix.shell().info("==== Create ENV file for PWA ===")
    Mix.shell().info("Setting envs: #{Enum.join(@envs, ", ")}")
    content =
      Enum.reduce(
        @envs,
        "",
        fn env, acc ->
          "#{acc}#{env} = '#{System.get_env(env)}'\n"
        end
      )

    res = File.write("assets/.env", content, [])
    Mix.shell().info("Done: #{inspect(res)}")
  end
end
