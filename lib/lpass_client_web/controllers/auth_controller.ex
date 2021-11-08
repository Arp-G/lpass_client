defmodule LpassClientWeb.AuthController do
  use LpassClientWeb, :controller
  import ShorterMaps

  action_fallback LpassClientWeb.FallbackController

  def sign_in(conn, ~m{username, password}) do
    case LpassClient.Auth.token_sign_in(username, password) do
      {:ok, token} ->
        render(conn, "token.json", token: token)

      _ ->
        conn
        |> put_status(:forbidden)
        |> json(%{error: "Forbidden"})
    end
  end

  def lpass_sign_in(conn, ~m{username, password}) do
    with {:ok, true} <- LpassClient.Api.login(username, password) do
      json(conn, %{message: "Successfully logged in as #{username}"})
    end
  end

  def sign_out(conn, _params) do
    case LpassClient.Api.logout() do
      {:ok, true} ->
        json(conn, %{message: "Successfully logged out"})

      _ ->
        conn
        |> put_status(422)
        |> json(%{error: "Failed"})
    end
  end
end
