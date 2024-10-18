export enum ServingStatus {
  UNKNOWN = 0,
  SERVING = 1,
  NOT_SERVING = 2,
  SERVICE_UNKNOWN = 3,
}

export interface HealthCheckRequest {
  service: string;
}

export interface HealthCheckResposne {
  status: ServingStatus;
}

export const HEALTH_PACKAGE_NAME = 'grpc.health.v1';
