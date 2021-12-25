defmodule LpassClient.MixProject do
  use Mix.Project

  def project do
    [
      app: :lpass_client,
      version: "0.1.0",
      elixir: "~> 1.12",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: Mix.compilers(),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      dialyzer: [plt_add_deps: :transitive]
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [
      mod: {LpassClient.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "test/support"]
  defp elixirc_paths(_), do: ["lib"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:argon2_elixir, "~> 2.4"},
      {:phoenix, "~> 1.6.2"},
      {:phoenix_html, "~> 3.0"},
      {:phoenix_live_reload, "~> 1.2", only: :dev},
      {:phoenix_live_view, "~> 0.16.0"},
      {:floki, ">= 0.30.0", only: :test},
      {:swoosh, "~> 1.3"},
      {:telemetry_metrics, "~> 0.6"},
      {:telemetry_poller, "~> 1.0"},
      {:jason, "~> 1.2"},
      {:plug_cowboy, "~> 2.5"},
      {:credo, "~> 1.5"},
      {:dialyxir, "~> 0.5.0", only: [:dev], runtime: false},
      {:shorter_maps, "~> 2.0"},
      {:nimble_csv, "~> 1.1"},
      {:httpoison, "~> 1.8"}
    ]
  end

  defp aliases do
    [
      setup: ["deps.get", "cmd --cd assets npm install"],
      "assets.deploy": [
        # Load envs for react app
        "create_assets_env",

        # Use tailwind cli to build css ouput at "priv/static/assets/app.css"
        # (Uses --postcss flag with tailwind cli which allows us to add extra postcss plugins via the postcss.config.js)
        "cmd --cd assets npm run deploy",

        # Invokes a custom build script for ESBuild to build js
        "cmd --cd assets node build.js --deploy",

        # Generate digest for static assets
        "phx.digest"
      ]
    ]
  end
end
