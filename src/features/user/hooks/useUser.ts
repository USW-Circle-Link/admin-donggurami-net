import { useMutation } from '@tanstack/react-query'
import * as api from '../api/userApi'
import type {
  ChangePasswordRequest,
  SendAuthCodeRequest,
  VerifyAuthCodeRequest,
  ResetPasswordRequest,
  TemporaryRegisterRequest,
  SignupRequest,
  UserLoginRequest,
  ExitAuthCodeRequest,
} from '../domain/userSchemas'

export function useChangePassword() {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) => api.changePassword(request),
  })
}

export function useFindAccount() {
  return useMutation({
    mutationFn: (email: string) => api.findAccount(email),
  })
}

export function useSendAuthCode() {
  return useMutation({
    mutationFn: (request: SendAuthCodeRequest) => api.sendAuthCode(request),
  })
}

export function useVerifyAuthCode() {
  return useMutation({
    mutationFn: (request: VerifyAuthCodeRequest) => api.verifyAuthCode(request),
  })
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (request: ResetPasswordRequest) => api.resetPassword(request),
  })
}

export function useCheckEmailDuplicate() {
  return useMutation({
    mutationFn: (email: string) => api.checkEmailDuplicate(email),
  })
}

export function useCheckAccountDuplicate() {
  return useMutation({
    mutationFn: (account: string) => api.checkAccountDuplicate(account),
  })
}

export function useTemporaryRegister() {
  return useMutation({
    mutationFn: (request: TemporaryRegisterRequest) => api.temporaryRegister(request),
  })
}

export function useConfirmEmailVerification() {
  return useMutation({
    mutationFn: (email: string) => api.confirmEmailVerification(email),
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: (request: SignupRequest) => api.signup(request),
  })
}

export function useUserLogin() {
  return useMutation({
    mutationFn: (request: UserLoginRequest) => api.userLogin(request),
  })
}

export function useSendExitCode() {
  return useMutation({
    mutationFn: api.sendExitCode,
  })
}

export function useExitUser() {
  return useMutation({
    mutationFn: (request: ExitAuthCodeRequest) => api.exitUser(request),
  })
}
