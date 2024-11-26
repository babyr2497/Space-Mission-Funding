;; SpaceMissionToken

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; Data vars
(define-data-var token-uri (string-utf8 256) u"")

;; SFTs
(define-fungible-token space-mission-token)

;; Mint space mission tokens
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ft-mint? space-mission-token amount recipient)
  )
)

;; Transfer space mission tokens
(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) err-not-token-owner)
    (ft-transfer? space-mission-token amount sender recipient)
  )
)

;; Get balance of space mission tokens
(define-read-only (get-balance (account principal))
  (ft-get-balance space-mission-token account)
)

;; Set token URI
(define-public (set-token-uri (new-uri (string-utf8 256)))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (ok (var-set token-uri new-uri))
  )
)

;; Get token URI
(define-read-only (get-token-uri)
  (ok (var-get token-uri))
)

