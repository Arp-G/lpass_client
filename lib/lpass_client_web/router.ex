defmodule LpassClientWeb.Router do
  use LpassClientWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, {LpassClientWeb.LayoutView, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :token_auth do
    plug LpassClientWeb.TokenAuth
  end

  scope "/api", LpassClientWeb do
    pipe_through [:api]

    post "/sign_in", AuthController, :sign_in
  end

  scope "/api", LpassClientWeb do
    pipe_through [:api, :token_auth]

    post "/sign_out", AuthController, :sign_out
    resources "/credentials", CredentialsController, except: [:new, :edit]
    post "/export", CredentialsController, :export
    get "/login_status", CredentialsController, :status
  end

  # Enables the Swoosh mailbox preview in development.
  #
  # Note that preview only shows emails that were sent by the same
  # node running the Phoenix server.
  if Mix.env() == :dev do
    scope "/dev" do
      pipe_through :browser

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end

  # Browser routes
  scope "/", LpassClientWeb do
    pipe_through :browser

    # Catch all route, just renders react app actual routing is handled by the react router
    get "/*path", AppController, :index
  end
end
