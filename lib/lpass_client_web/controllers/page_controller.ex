defmodule LpassClientWeb.PageController do
  use LpassClientWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
