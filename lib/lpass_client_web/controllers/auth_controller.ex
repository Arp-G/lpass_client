defmodule LpassClientWeb.AuthController do
  use LpassClientWeb, :controller
  import ShorterMaps

  action_fallback LpassClientWeb.FallbackController

  def sign_in(conn, ~m{lpassUsername, serverPassword, lpassPassword}) do
    case LpassClient.Auth.sign_in(lpassUsername, serverPassword, lpassPassword) do
      {:ok, token} ->
        render(conn, "token.json", token: token)

      _ ->
        conn
        |> put_status(:forbidden)
        |> json(%{error: "Forbidden"})
    end
  end

  def sign_out(conn, _params) do
    LpassClient.Api.logout()
    json(conn, %{message: "Successfully logged out"})
  end
end
