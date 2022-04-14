export interface User {
    uuid: string;
    first_name: string;
    last_name: string;
    display_name: string;
    username?: string;
    userStatus?: UserStatus;
    email?: string;
    groups?: string[];
    isObserver?: boolean;
    admissionInfo?: AdmissionInfo;
    xAuthPermissions?: string[];
    xPermissions?: Record<string, boolean>;
    xGlobalPermissions?: Record<string, boolean>;
    xEnabledUiFlags?: string[];
    xProvider?: Provider;
}

export interface AdmissionInfo {
    browserId: string;
    waitingId?: string;
    token?: string;
    joinMuted?: boolean;
}
export interface UserStatus {
    aud: string;
    auth_time: number;
    exp: number;
    iat: number;
    iss: string;
    plru: string;
    sub: string;
}
export interface Provider {
    uuid: string;
    created: Date;
    modified: Date;
    is_active: boolean;
    user: string;
    salesforce_id: string;
    provider_types: string[];
    phone: string;
    billing_street: string;
    billing_city: string;
    billing_postal_code: string;
    billing_state: string;
    billing_country: string;
    first_name: string;
    last_name: string;
    timezone: string;
    username: string;
    email: string;
    caseload_clients_count?: number;
    in_retainer_program: boolean;
    bill_as_employee: boolean;
    is_onboarding_wizard_complete: boolean;
}
