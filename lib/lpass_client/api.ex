defmodule LpassClient.Api do
  @moduledoc """
    This module provides a high level API to interact with the lpass cli tool
  """
  import ShorterMaps
  alias LpassClient.{Cli, Credential}
  alias NimbleCSV.RFC4180, as: CSV
  @ls_regex ~r/.*\/(?<name>.*) \[id: (?<id>.*)\] \[username: .*\]/

  @type error() :: {:error, :forbidden} | {:error, String.t()}

  @doc """
  Login to Lastpass

  ## Examples
    iex(4)> LpassClient.Api.login("correct@gmail.com", "testpass")
    {:success, true}

    iex(4)> LpassClient.Api.login("incorrect@gmail.com", "testpass")
    {:error, :forbidden}
  """
  @spec login(String.t(), String.t()) :: {:success | :error, true | :forbidden}
  def login(username, password) do
    Cli.login(username, password)
    |> String.contains?("Success:")
    |> if(do: {:success, true}, else: {:error, :forbidden})
  end

  @doc """
  Logout from Lastpass

  ## Examples
    iex(10)> LpassClient.Api.logout
    {:success, true}
  """
  @spec logout() :: {:success, true}
  def logout() do
    Cli.logout()
    {:success, true}
  end

  @doc """
  Get all credentials(only id and name) stored with Lastpass

  ## Examples
    iex(10)> LpassClient.Api.get_all()
    {:success,
      [
        %LpassClient.Credential{id: "456", name: "Netflix", ...},
        %LpassClient.Credential{id: "123", name: "Gmail", ...},
        %LpassClient.Credential{id: "789", name: "Facebook, ..."}
      ]
    }

    iex(10)> LpassClient.Api.get_all()
    {:error, :forbidden}
  """
  @spec get_all() :: {:success, [%Credential{}]} | error()
  def get_all() do
    Cli.ls()
    |> check_error(fn res ->
      list =
        res
        |> String.split("\n")
        |> Enum.flat_map(fn credential ->
          Regex.named_captures(@ls_regex, credential)
          |> case do
            ~m{id, name} when not is_nil(id) and not is_nil(name) ->
              [~M{%Credential id, name}]

            _ ->
              []
          end
        end)

      {:ok, list}
    end)
  end

  @doc """
  Get a data dump of all credentials stored with Lastpass

  ## Examples
    iex(10)> LpassClient.Api.export("correctpass")
    {:success,
      [
        %LpassClient.Credential{id: "456", name: "Netflix", ...},
        %LpassClient.Credential{id: "123", name: "Gmail", ...},
        %LpassClient.Credential{id: "789", name: "Facebook, ..."}
      ]
    }

    iex(12)>  LpassClient.Api.get_exported("incorrectpass")
    {:error,
    "Please enter the LastPass master password for <testuser@gmail.com>.\n\nIncorrect master password; please try again.\nMaster Password: Error: Could not authenticate for protected entry."
    }
  """
  @spec get_exported(String.t()) :: {:success, [%Credential{}]} | error()
  def get_exported(password) do
    Cli.export(password)
    |> check_error(fn res ->
      data =
        res
        |> CSV.parse_string()
        |> Enum.map(fn [
                         id,
                         name,
                         url,
                         username,
                         password,
                         note,
                         group,
                         _fav,
                         last_modified_gmt,
                         last_touch
                       ] ->
          ~M{%Credential
              id, name, url, username, password, group, note,
              last_modified_gmt: parsed_timestamp(last_modified_gmt),
              last_touch: parsed_timestamp(last_touch)
            }
        end)
        |> fetch_favicons()

      {:ok, data}
    end)
  end

  @doc """
  Get the Lastpass credential details for the given id or name

  ## Examples
    iex(5)> LpassClient.Api.get("123")
      {:success,
      %LpassClient.Credential{
        group: "Social",
        id: "123",
        last_modified_gmt: ~U[2021-10-28 05:12:08Z],
        last_touch: nil,
        name: "FB Account",
        note: "Some note...",
        password: "fbtest",
        url: "https://www.facebook.com/",
        username: "test@gmail.com"
      }}

    iex(4)> LpassClient.Api.get("abc")
    {:error, "Could not find specified account(s)."}
  """
  @spec get(String.t()) :: {:success, %Credential{}} | error()
  def get(id) do
    Cli.show(id)
    |> check_error(fn resp ->
      case Jason.decode(resp) do
        {:ok,
         [
           ~m{id, name, url, username, password, group, note, last_modified_gmt, last_touch}
         ]} ->
          {:ok, ~M{%Credential
              id, name, url, username, password, group, note,
              last_modified_gmt: parsed_timestamp(last_modified_gmt),
              last_touch: parsed_timestamp(last_touch)
            }}

        _ ->
          {:error, "Failed to parse response"}
      end
    end)
  end

  @doc """
  Save a new credential information with lastpass

  ## Examples
    iex(8)> LpassClient.Api.create("Email", %{note: "an email", url: "gmail.com", username: "test@gmail.com", password: "mypass"})
    {:success, true}
  """
  @spec create(String.t(), map()) :: {:success, true} | error()
  def create(name, data) when not is_nil(name) do
    name
    |> Cli.add(data)
    |> check_error(fn _ -> {:ok, true} end)
  end

  def create(_name, _data), do: {:error, "Name is required"}

  @doc """
  Update a stored credential information with lastpass

  ## Examples
    iex(8)> LpassClient.Api.update("123", %{note: "updated note", url: "gmail.com", username: "test@gmail.com", password: "mypass"})
    {:success, true}
  """
  @spec update(String.t(), map()) :: {:success, true} | error()
  def update(id, data) when not is_nil(id) do
    id
    |> Cli.edit(data)
    |> check_error(fn _ -> {:ok, true} end)
  end

  def update(_id, _data), do: {:error, "Id is required"}

  @doc """
  Remove a stored credential from lastpass

  ## Examples
    iex(1)> LpassClient.Api.delete("123")
    {:success, true}

    iex(3)> LpassClient.Api.delete("123")
    {:error, "Could not find specified account '123'."}
  """
  @spec delete(String.t()) :: {:success, true} | error()
  def delete(id) do
    Cli.rm(id)
    |> check_error(fn _ -> {:ok, true} end)
  end

  defp check_error(resp, parser) do
    error = String.contains?(resp, "Error:")

    cond do
      error && String.contains?(resp, "Could not find decryption key.") ->
        {:error, :forbidden}

      error ->
        {:error, resp |> String.trim_leading("Error: ") |> String.trim()}

      true ->
        case parser.(resp) do
          {:ok, result} -> {:success, result}
          {:error, reason} -> {:error, reason}
        end
    end
  end

  defp parsed_timestamp(timestamp) do
    unix_timestamp = String.to_integer(timestamp)

    if unix_timestamp == 0 do
      nil
    else
      DateTime.from_unix(unix_timestamp)
      |> case do
        {:ok, date_time} -> date_time
        {:error, _} -> nil
      end
    end

  rescue
    ArgumentError -> nil
  end

  defp fetch_favicons(credentails) do
    favi_icons =
      credentails
      |> Enum.map(fn ~M{%Credential url} ->
        Task.async(fn ->
          case HTTPoison.get("https://www.google.com/s2/favicons?sz=128&domain_url=#{url}") do
            {:ok, response} ->
              body = Map.get(response, :body)

              cond do
                is_nil(body) ->
                  nil

                body
                |> String.slice(0..3)
                |> String.downcase()
                |> String.trim()
                |> String.starts_with?(["<!", "ht", "<ht"]) ->
                  nil

                true ->
                  Base.encode64(body)
              end

            _ ->
              nil
          end
        end)
      end)
      |> Task.yield_many(10_000)
      |> Enum.map(fn
        {_task, {:ok, resp}} ->
          resp

        # Task died
        {_task, {:exit, _reason}} ->
          nil

        {task, nil} ->
          # Running past the timeout
          Task.shutdown(task, :brutal_kill)
          nil
      end)

    Enum.zip_with(credentails, favi_icons, fn credentail, favicon ->
      %{credentail | favicon: favicon}
    end)
  end
end
