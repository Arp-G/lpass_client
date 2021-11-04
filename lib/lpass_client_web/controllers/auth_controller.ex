defmodule LpassClientWeb.AuthController do
  use LpassClientWeb, :controller

  action_fallback LpassClientWeb.FallbackController

  def sign_in(conn, %{"username" => username, "password" => password}) do
    case LpassClient.Auth.token_sign_in(username, password) do
      {:ok, token} ->
        render(conn, "token.json", token: token)

      _ ->
        conn
        |> put_status(:forbidden)
        |> json(%{error: "Forbidden"})
    end
  end
end
