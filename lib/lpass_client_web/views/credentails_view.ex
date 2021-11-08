defmodule LpassClientWeb.CredentailsView do
  use LpassClientWeb, :view
  import ShorterMaps
  alias LpassClient.Credential

  def render("index.json", ~M{resp}) do
    %{data: Enum.map(resp, fn ~M{%Credential id, name} -> ~M{id, name} end)}
  end

  def render("show.json", %{
        resp:
          ~M{%Credential id, name, url, username, password, group, note, last_modified_gmt, last_touch}
      }) do
    %{data: ~M{id, name, url, username, password, group, note, last_modified_gmt, last_touch}}
  end

  def render("export.json", ~M{resp}) do
    %{
      data:
        Enum.map(
          resp,
          fn ~M{%Credential id, name, url, username, password, group, note, last_modified_gmt, last_touch} ->
            ~M{id, name, url, username, password, group, note, last_modified_gmt, last_touch}
          end
        )
    }
  end
end
