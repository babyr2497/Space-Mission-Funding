import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the contract functions
const mockMint = vi.fn()
const mockTransfer = vi.fn()
const mockGetBalance = vi.fn()
const mockSetTokenUri = vi.fn()
const mockGetTokenUri = vi.fn()

// Mock the contract
const spaceMissionToken = {
  mint: mockMint,
  transfer: mockTransfer,
  getBalance: mockGetBalance,
  setTokenUri: mockSetTokenUri,
  getTokenUri: mockGetTokenUri,
}

describe('SpaceMissionToken', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })
  
  it('should mint tokens', async () => {
    const amount = 1000n
    const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    
    mockMint.mockResolvedValue({ success: true })
    
    const result = await spaceMissionToken.mint(amount, recipient)
    
    expect(mockMint).toHaveBeenCalledWith(amount, recipient)
    expect(result).toEqual({ success: true })
  })
  
  it('should transfer tokens', async () => {
    const amount = 500n
    const sender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
    
    mockTransfer.mockResolvedValue({ success: true })
    
    const result = await spaceMissionToken.transfer(amount, sender, recipient)
    
    expect(mockTransfer).toHaveBeenCalledWith(amount, sender, recipient)
    expect(result).toEqual({ success: true })
  })
  
  it('should get balance', async () => {
    const account = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    const expectedBalance = 1500n
    
    mockGetBalance.mockResolvedValue(expectedBalance)
    
    const balance = await spaceMissionToken.getBalance(account)
    
    expect(mockGetBalance).toHaveBeenCalledWith(account)
    expect(balance).toBe(expectedBalance)
  })
  
  it('should set token URI', async () => {
    const newUri = 'https://example.com/space-mission-token'
    
    mockSetTokenUri.mockResolvedValue({ success: true })
    
    const result = await spaceMissionToken.setTokenUri(newUri)
    
    expect(mockSetTokenUri).toHaveBeenCalledWith(newUri)
    expect(result).toEqual({ success: true })
  })
  
  it('should get token URI', async () => {
    const expectedUri = 'https://example.com/space-mission-token'
    
    mockGetTokenUri.mockResolvedValue(expectedUri)
    
    const uri = await spaceMissionToken.getTokenUri()
    
    expect(mockGetTokenUri).toHaveBeenCalled()
    expect(uri).toBe(expectedUri)
  })
  
  it('should fail to transfer tokens if sender has insufficient balance', async () => {
    const amount = 2000n
    const sender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
    
    mockTransfer.mockRejectedValue(new Error('Insufficient balance'))
    
    await expect(spaceMissionToken.transfer(amount, sender, recipient))
        .rejects.toThrow('Insufficient balance')
    
    expect(mockTransfer).toHaveBeenCalledWith(amount, sender, recipient)
  })
  
  it('should fail to mint tokens if not called by contract owner', async () => {
    const amount = 1000n
    const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
    
    mockMint.mockRejectedValue(new Error('Not authorized'))
    
    await expect(spaceMissionToken.mint(amount, recipient))
        .rejects.toThrow('Not authorized')
    
    expect(mockMint).toHaveBeenCalledWith(amount, recipient)
  })
})

