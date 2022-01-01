defmodule LpassClient.Cache do
  @moduledoc """
  Simple Genserver based cache
  """
  use GenServer

  # Public api
  def put(key, value), do: GenServer.cast(__MODULE__, {:put, key, value})

  def get(key), do: GenServer.call(__MODULE__, {:get, key})

  def start_link(_opts), do: GenServer.start_link(__MODULE__, %{}, name: __MODULE__)

  # Implementations
  @impl true
  def init(state), do: {:ok, state}

  @impl true
  def handle_call({:get, key}, _from, state), do: {:reply, Map.get(state, key), state}

  @impl true
  def handle_cast({:put, key, value}, state), do: {:noreply, Map.put(state, key, value)}
end
