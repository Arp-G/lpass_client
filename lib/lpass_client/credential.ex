defmodule LpassClient.Credential do
  @moduledoc """
    Represents a credential stored in lastpass
  """

  @enforce_keys [:id, :name]
  defstruct id: nil,
            name: nil,
            url: nil,
            favicon: nil,
            username: nil,
            password: nil,
            note: nil,
            group: nil,
            last_modified_gmt: nil,
            last_touch: nil

  @type t() :: %__MODULE__{
          id: String.t(),
          name: String.t(),
          url: String.t(),
          favicon: binary(),
          username: String.t(),
          password: String.t(),
          note: String.t(),
          group: String.t(),
          last_modified_gmt: t(),
          last_touch: t()
        }
end
