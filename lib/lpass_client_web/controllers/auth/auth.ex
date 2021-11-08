defmodule LpassClientWeb.TokenAuth do
  use LpassClientWeb, :controller

  def init(opts), do: opts

  def call(conn, _opts) do
    conn
    |> current_resource()
    |> case do
      {:ok, _} ->
        assign(conn, :logged_id, true)

      {:error, _} ->
        conn
        |> put_status(:unauthorized)
        |> json(%{error: "Unauthorized"})
        |> halt()
    end
  end

  defp current_resource(conn) do
    token =
      conn
      |> get_req_header("authorization")
      |> get_token()
      |> String.replace_leading("Bearer ", "")

    Phoenix.Token.verify(
      Application.get_env(:lpass_client, LpassClient.Auth)[:secret_key],
      Application.get_env(:lpass_client, LpassClient.Auth)[:salt],
      token,
      # 30 days
      max_age: 86_400 * 30
    )
  end

  defp get_token([token]), do: token
  defp get_token([]), do: ""
end
