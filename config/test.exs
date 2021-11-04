import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :lpass_client, LpassClientWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "wSEkjm8oPiBXHlRAJEkP8fIriTQLAst1UHWG5Qg1w2fT/pjWVKmAtjxEFs2a8hb7",
  server: false

# In test we don't send emails.
config :lpass_client, LpassClient.Mailer, adapter: Swoosh.Adapters.Test

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
