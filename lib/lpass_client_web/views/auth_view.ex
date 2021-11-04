defmodule LpassClientWeb.AuthView do
  use LpassClientWeb, :view

  def render("token.json", %{token: token}) do
    %{token: token}
  end
end
