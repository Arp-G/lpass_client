export type MessageType = 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
export type AlertType = { type: MessageType, message: string, timeout: number | undefined }
export type Credential = {
  id: string,
  name: string,
  url?: string,
  favicon?: string,
  username?: string,
  password?: string,
  note?: string,
  group?: string,
  last_modified_gmt?: string,
  last_touch?: string
}
export type SortOrder = 'A-Z' | 'TIME';
export type CredentialsHash = { [key: string]: Credential }
