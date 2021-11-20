export type ALERT_TYPE = 'SUCCESS' | 'INFO' | 'WARNING' | 'ERROR';
export type ALERT = { type: ALERT_TYPE, message: string, timeout: number | undefined }
