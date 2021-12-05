defmodule LpassClientWeb.CredentialsController do
  use LpassClientWeb, :controller
  import ShorterMaps
  alias LpassClient.Api

  action_fallback LpassClientWeb.FallbackController

  def index(conn, _params) do
    with {:success, resp} <- Api.get_all() do
      render(conn, resp: resp)
    end
  end

  def show(conn, ~m{id}) do
    with {:success, resp} <- Api.get(id) do
      render(conn, resp: resp)
    end
  end

  # TODO: Can't save notes and group data
  def create(conn, ~m{name} = params) do
    with {:success, true} <- Api.create(name, params) do
      json(conn, %{id: get_credential(name), message: "Successfully saved!"})
    end
  end

  def update(conn, ~m{id} = params) do
    with {:success, true} <- Api.update(id, params) do
      json(conn, %{message: "Successfully updated!"})
    end
  end

  def delete(conn, ~m{id}) do
    with {:success, true} <- Api.delete(id) do
      json(conn, %{message: "Successfully deleted!"})
    end
  end

  def export(conn, ~m{password}) do
    with {:success, resp} <- Api.get_exported(password) do
      render(conn, "export.json", resp: resp)
    end
  end

  def status(conn, _params) do
    with {:success, status} <- Api.logged_in?() do
      json(conn, %{logged_in: status})
    end
  end

  defp get_credential(name) do
    case Api.get(name) do
      {:success, credential} ->
        credential.id

      _ ->
        nil
    end
  end
end
