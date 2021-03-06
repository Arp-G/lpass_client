defmodule LpassClient.Auth do
  def sign_in(lpassUsername, serverPassword, lpassPassword) do
    application_auth = Application.get_env(:lpass_client, LpassClient.Auth)

    if Argon2.verify_pass(serverPassword, application_auth[:password]) do
      case LpassClient.Api.login(lpassUsername, lpassPassword) do
        {:success, true} ->
          {:ok,
           Phoenix.Token.sign(
             application_auth[:secret_key],
             application_auth[:salt],
             :rand.uniform(10_000)
           )}

        _ ->
          {:error, :unauthorized}
      end
    else
      {:error, :unauthorized}
    end
  end
end
