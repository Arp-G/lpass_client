defmodule Mix.Tasks.ServerPasswordHasher do
  @moduledoc "Generates hashed server password, run using: `mix serverpasswordhasher \"serverpassword\"`"
  @shortdoc "Generates hashed server password"

  use Mix.Task

  @impl Mix.Task
  def run([password | _rest]) when password != "",
    do: Mix.shell().info(Argon2.hash_pwd_salt(password))

  def run([]),
    do:
      raise(
        "No password specified!, Specify a password like: mix server_password_hasher \"your server password here\""
      )
end
