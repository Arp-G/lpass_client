defmodule LpassClient.Cli do
  @moduledoc """
    This module provides an elixir api for low level access to lpass cli tool
  """
  alias LpassClient.Shell
  @lpass "/usr/bin/lpass"

  @doc """
  The login subcommand will initialize a local cache and configuration folder, then attempt to authenticate itself with the LastPass servers,
  using the provided command line credentials or by interactively prompting (in the case of multifactor or an unprovided password).
  The --trust option will cause subsequent logins to not require multifactor authentication.
  If the --plaintext-key option is specified, the decryption key will be saved to the hard disk in plaintext.
  LPASS_DISABLE_PINENTRY environment variable is set to 1, passwords will be read from standard input and a prompt will be displayed on standard error.

  lpass login [--trust] [--plaintext-key [--force, -f]] [--color=auto|never|always] USERNAME

  ## Examples
    iex(48)> LpassClient.Cli.login("test@gmail.com", "testpass")
    Please enter the LastPass master password for <test@gmail.com>.                 "Success: Logged in as test@gmail.com.\n"

    iex(53)> LpassClient.Cli.login("test@gmail.com", "incorrectpass")
    Please enter the LastPass master password for <arpanError: Failed to enter correct password.
  """
  def login(username, password, args \\ []) do
    default_args = [trust: true, "plaintext-key": false, force: true]
    cmd_args = build_args(default_args, args)

    {resp, _exit_status} =
      System.shell(
        "echo #{Shell.escape(password)} | LPASS_DISABLE_PINENTRY=1 #{@lpass} login #{cmd_args} #{Shell.escape(username)}",
        stderr_to_stdout: true
      )

    resp
  end

  @doc """
  lpass logout [--force, -f] [--color=auto|never|always]

  ## Examples
    iex(50)> LpassClient.Cli.logout
    "Log out: complete.\n"
  """
  def logout(args \\ []) do
    default_args = [force: true]
    cmd_args = build_args(default_args, args)
    {resp, _exit_status} = System.shell("#{@lpass} logout #{cmd_args}", stderr_to_stdout: true)
    resp
  end

  @doc """
  lpass ls [--sync=auto|now|no] [--long, -l] [-m] [-u] [--color=auto|never|always] [GROUP]

  ## Examples
  iex(59)> LpassClient.Cli.ls
    "2018-06-27 14:41 (none)/Netflix  [id: 123] [username: User1]\n2020-02-22 05:11 (none)/AWS [id: 456] [username: test@gmail.com]\n"

    iex(57)> LpassClient.Cli.ls
    Error: Could not find decryption key. Perhaps you need to login with `/usr/bin/lpass login`.
  """
  def ls(args \\ []) do
    default_args = [long: true, sync: "auto"]
    cmd_args = build_args(default_args, args)
    {resp, _exit_status} = System.shell("#{@lpass} ls #{cmd_args}", stderr_to_stdout: true)
    resp
  end

  @doc """
  lpass show [--sync=auto|now|no] [--clip, -c] [--quiet, -q] [--expand-multi, -x] [--json, -j] [--all|--username|--password|--url|--notes|--field=FIELD|--id|--name|--attach=ATTACHID] [--basic-regexp, -G|--fixed-strings, -F] [--color=auto|never|always] {NAME|UNIQUEID}*

  ## Examples
    iex(59)> LpassClient.Cli.show("12345")
    "[\n  {\n    \"id\": \"12345\",\n    \"name\": \"instagram.com\",\n    \"fullname\": \"Social/instagram.com\",\n    \"username\": \"test@gmail.com\",\n    \"password\": \"testpass\",\n    \"last_modified_gmt\": \"1598645622\",\n    \"last_touch\": \"1606716775\",\n    \"group\": \"Social\",\n    \"url\": \"http://www.instagram.com\",\n    \"note\": \"\" \n  } \n] \n"

    iex(57)> LpassClient.Cli.show("12345")
    Error: Could not find specified account(s).

    iex(57)> LpassClient.Cli.show("12345")
    Error: Could not find decryption key. Perhaps you need to login with `/usr/bin/lpass login`.
  """
  def show(name_or_id, args \\ []) do
    default_args = [
      sync: "auto",
      clip: false,
      "expand-multi": true,
      json: true,
      all: true,
      username: false,
      password: false,
      url: false,
      notes: false,
      field: false,
      id: false,
      name: false,
      attach: false,
      "basic-regexp": false,
      "fixed-strings": false
    ]

    cmd_args = build_args(default_args, args)

    {resp, _exit_status} =
      System.shell("#{@lpass} show #{cmd_args} #{Shell.escape(name_or_id)}",
        stderr_to_stdout: true
      )

    resp
  end

  @doc """
  lpass add [--sync=auto|now|no] [--non-interactive] {--name|--username, -u|--password, -p|--url|--notes|--field=FIELD|--note-type=NOTETYPE} [--color=auto|never|always] {NAME|UNIQUEID}

  ## Examples
    iex(57)> LpassClient.Cli.add("Facebook", username: "test@gmail.com", password: "123456", url: "facebook.com", note: "My facebook account")
    ""

    iex(57)> LpassClient.Cli.add("Facebook", username: "test@gmail.com", password: "123456", url: "facebook.com", note: "My facebook account")
    Error: Could not find decryption key. Perhaps you need to login with `/usr/bin/lpass login`.
  """
  def add(name, args \\ []), do: add_or_update_args(name, args, :add)

  @doc """
  lpass edit [--sync=auto|now|no] [--non-interactive] {--name|--username, -u|--password, -p|--url|--notes|--field=FIELD} [--color=auto|never|always] {NAME|UNIQUEID}

  ## Examples
    iex(57)> LpassClient.Cli.edit("Facebook", username: "test@gmail.com", password: "123456", url: "facebook.com", notes: "editednote")
    ""

    iex(57)> LpassClient.Cli.edit("54225", username: "test@gmail.com", password: "123456", url: "facebook.com", note: "editednote")
    Error: Could not find decryption key. Perhaps you need to login with `/usr/bin/lpass login`.
  """
  def edit(name_or_id, args \\ []), do: add_or_update_args(name_or_id, args, :edit)

  @doc """
  lpass rm [--sync=auto|now|no] [--color=auto|never|always] {UNIQUENAME|UNIQUEID}

  ## Examples
    iex(9)> LpassClient.Cli.rm("123")
    ""

    iex(10)> LpassClient.Cli.rm("123")
    Error: Could not find specified account '123'.

    iex(57)> LpassClient.Cli.rm("456")
    Error: Could not find decryption key. Perhaps you need to login with `/usr/bin/lpass login`.
  """
  def rm(name_or_id, args \\ []) do
    default_args = [sync: "auto"]
    cmd_args = build_args(default_args, args)

    {resp, _exit_status} =
      System.shell("#{@lpass} rm #{cmd_args} #{Shell.escape(name_or_id)}", stderr_to_stdout: true)

    resp
  end

  @doc """
  lpass export [--sync=auto|now|no] [--color=auto|never|always] [--fields=FIELDLIST]

  ## Examples
    iex(9)> LpassClient.Cli.export("correctpass")
    "id,name,url,username,password,note,group,last_modified_gmt,last_touch\r\n12345,gmail,http://gmail.com,,mypass,,,1636338918,1636304385\r\567,amazon,http://amazon.com,,amazonpass,,,1636338897,1636304386\r\n"

    iex(27)> LpassClient.Cli.export("incorrectpass")
    "Please enter the LastPass master password for <test@gmail.com>.\n\nIncorrect master password; please try again.\nMaster Password: Error: Could not authenticate for protected entry.\n"
  """
  def export(password, args \\ []) do
    default_args = [
      sync: "auto",
      fields: "id,name,url,username,password,extra,group,fav,last_modified_gmt,last_touch"
    ]

    cmd_args = build_args(default_args, args)

    {resp, _exit_status} =
      System.shell(
        "echo #{Shell.escape(password)} | LPASS_DISABLE_PINENTRY=1 #{@lpass} export #{cmd_args}",
        stderr_to_stdout: true
      )

    String.trim_leading(
      resp,
      "Please enter the LastPass master password for <arpanghoshal3@gmail.com>.\n\nMaster Password: \n"
    )
  end

  @doc """
  lpass status [--quiet, -q] [--color=auto|never|always]

  ## Examples
    iex(11)> LpassClient.Cli.status
    "Logged in as test@gmail.com.\n"

    iex(13)> LpassClient.Cli.status
    "Not logged in.\n"
  """
  def status(_args \\ []) do
    {resp, _exit_status} = System.shell("#{@lpass} status", stderr_to_stdout: true)
    resp
  end

  @doc """
  lpass sync [--background, -b] [--color=auto|never|always]

  ## Examples
    iex(16)> LpassClient.Cli.sync
    ""

    iex(14)> LpassClient.Cli.sync
    Error: Could not find decryption key. Perhaps you need to login with `/usr/bin/lpass login`.
  """
  def sync(args \\ []) do
    default_args = [background: false]
    cmd_args = build_args(default_args, args)
    {resp, _exit_status} = System.shell("#{@lpass} sync #{cmd_args}")
    resp
  end

  # Private helper methods
  defp add_or_update_args(name_or_id, args, type) when type in [:add, :edit] do
    default_args = [
      sync: "now",
      "non-interactive": true,
      field: false,
      "note-type": false
    ]
    cmd_args = build_args(default_args, args)

    data = [
      Username: args[:username] || args["username"],
      Password: args[:password] || args["password"],
      URL: args[:url] || args["url"]
    ]

    data =
      if type == :edit do
        group = args[:group] || args["group"]
        name = args[:name] || args["name"]

        name_and_group =
          cond do
            group && name -> "#{group}/#{name}"
            group -> "#{group}/"
            name -> "/#{name}"
            true -> "/"
          end

        [{"Name", name_and_group} | data]
      else
        data
      end

    name_or_id =
      if type == :add do
        group = args[:group] || args["group"]
        if group, do: "#{group}/#{name_or_id}", else: "/#{name_or_id}"
      else
        name_or_id
      end

    data =
      if(is_nil(args[:notes]) && is_nil(args["notes"]),
        do: data,
        else: data ++ [{"Notes", "\n#{args[:notes] || args["notes"]}"}]
      )

    entry_data =
      data
      # Reject nil keys
      |> Enum.reject(&is_nil(elem(&1, 1)))
      |> Enum.map(fn {key, value} -> "#{key}: #{value}" end)
      |> Enum.join("\n")

    # Using printf instead of echo preserves lines breaks
    {resp, _exit_status} =
      System.shell(
        "printf \"#{entry_data}\" | #{@lpass} #{type} #{cmd_args} #{Shell.escape(name_or_id)}",
        stderr_to_stdout: true
      )

    resp
  end

  defp build_args(defaults, args) do
    accepted_keys = defaults |> Keyword.keys() |> Enum.map(&"#{&1}")

    cleaned_args =
      args
      |> Enum.map(fn
        {key, val} -> {"#{key}", val}
        key -> {"#{key}", true}
      end)
      |> Enum.filter(fn {key, _val} -> Enum.member?(accepted_keys, key) end)
      |> Enum.map(fn {key, val} -> {String.to_atom(key), val} end)
      |> Enum.uniq_by(fn {key, _val} -> key end)

    defaults
    |> Enum.map(fn {key, val} ->
      Enum.find(cleaned_args, fn {arg_key, _arg_val} -> arg_key == key end) || {key, val}
    end)
    |> Enum.reduce([], fn
      {key, value}, args when is_boolean(value) and value == true ->
        [make_arg(key) | args]

      {_key, value}, args when is_boolean(value) and value == false ->
        args

      {key, value}, args when is_binary(value) and value == "true" ->
        [make_arg(key) | args]

      {_key, value}, args when is_binary(value) and value == "false" ->
        args

      {key, value}, args when is_binary(value) ->
        ["#{make_arg(key)}=#{Shell.escape(value)}" | args]
    end)
    |> Enum.join(" ")
  end

  defp make_arg(arg), do: "#{Shell.escape("--#{arg}")}"
end
