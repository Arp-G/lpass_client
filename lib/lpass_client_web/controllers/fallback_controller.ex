defmodule LpassClientWeb.FallbackController do
  use LpassClientWeb, :controller

  def call(conn, {:error, :forbidden}) do
    conn
    |> put_status(:forbidden)
    |> json(%{error: "Forbidden"})
  end

  def call(conn, {:error, reason}) do
    conn
    |> put_status(422)
    |> json(%{error: reason})
  end
end
