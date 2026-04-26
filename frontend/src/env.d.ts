/// <reference types="vite/client" />

type AiProviderConfig = {
  id: string
  name: string
  endpoint: string
  method: 'POST' | 'PUT'
  headersTemplate: Record<string, string>
  bodyTemplate: string
  responseImagePath: string
  timeoutMs: number
  variables?: Record<string, string>
}

type AiOptimizeVariables = Record<string, string>

interface Window {
  aipindou?: {
    providers: {
      list: () => Promise<AiProviderConfig[]>
      save: (provider: AiProviderConfig) => Promise<AiProviderConfig[]>
      remove: (id: string) => Promise<AiProviderConfig[]>
    }
    ai: {
      optimizeImage: (payload: { providerId: string; variables: AiOptimizeVariables }) => Promise<{ image: string }>
    }
  }
}
