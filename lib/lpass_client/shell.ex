defmodule LpassClient.Shell do
  @moduledoc """
    Escape Shell arguments
    Implementation taken from: https://gist.github.com/sumerman/b68128e09d1545cea981
  """

  # TODO: This is not working properly in all cases with quotes and slashes
  def escape(value), do: escape_value(value, "")
  defp escape_value("", res), do: "\"#{res}\""
  # defp escape_value("\"" <> value, res), do: escape_value(value, res <> "\\\"")
  # defp escape_value("\\" <> value, res), do: escape_value(value, res <> "\\\\")

  defp escape_value(<<char::utf8, rest::binary>>, res),
    do: escape_value(rest, res <> <<char>>)
end
