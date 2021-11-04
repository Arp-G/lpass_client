defmodule LpassClient.Auth do
  def token_sign_in(username, password) do
    application_auth = Application.get_env(:lpass_client, LpassClient.Auth)

    if application_auth[:username] == username && application_auth[:password] == password do
      {:ok,
       Phoenix.Token.sign(
         application_auth[:secret_key],
         application_auth[:salt],
         :rand.uniform(10_000)
       )}
    else
      {:error, :unauthorized}
    end
  end
end
