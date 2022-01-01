defmodule LpassClient.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      # Start the Telemetry supervisor
      LpassClientWeb.Telemetry,

      # Start the PubSub system
      {Phoenix.PubSub, name: LpassClient.PubSub},

      # Genserver to periodically sync local app with lastpass server
      LpassClient.Syncer,

      # Genserver to cache data
      LpassClient.Cache,

      # Custom hackney pool ":main" to serve more number of concurrent connections
      :hackney_pool.child_spec(:main, timeout: 15_000, max_connections: 100),

      # Start the Endpoint (http/https)
      LpassClientWeb.Endpoint

      # Start a worker by calling: LpassClient.Worker.start_link(arg)
      # {LpassClient.Worker, arg}
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: LpassClient.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    LpassClientWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
