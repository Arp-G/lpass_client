defmodule LpassClient.Syncer do
  @moduledoc """
  Genserver to periodically sync local app with lastpass server
  """
  use GenServer
  require Logger

  # 1 hour
  @interval 3600 * 1000

  def start_link(_opts) do
    GenServer.start_link(__MODULE__, %{})
  end

  def init(state) do
    Process.send_after(self(), :work, @interval)
    {:ok, state}
  end

  def handle_info(:work, state) do
    Logger.info("#{DateTime.to_string(DateTime.utc_now())} Begin Sync")
    time = :timer.tc(&LpassClient.Cli.sync/0) |> elem(0) |> Kernel./(1_000_000)
    Logger.info("Finish Sync in #{time} seconds")
    Process.send_after(self(), :work, @interval)

    {:noreply, state}
  end
end
