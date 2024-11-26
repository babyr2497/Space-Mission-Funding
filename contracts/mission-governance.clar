;; MissionGovernance

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-found (err u101))
(define-constant err-already-exists (err u102))
(define-constant err-voting-closed (err u103))

;; Data maps
(define-map proposals
  { proposal-id: uint }
  {
    title: (string-utf8 100),
    description: (string-utf8 500),
    votes-for: uint,
    votes-against: uint,
    voting-ends-at: uint
  }
)

(define-map votes
  { proposal-id: uint, voter: principal }
  { vote: bool }
)

;; Public functions
(define-public (create-proposal (proposal-id uint) (title (string-utf8 100)) (description (string-utf8 500)) (voting-duration uint))
  (let (
    (proposal {
      title: title,
      description: description,
      votes-for: u0,
      votes-against: u0,
      voting-ends-at: (+ block-height voting-duration)
    })
  )
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (asserts! (is-none (map-get? proposals { proposal-id: proposal-id })) err-already-exists)
    (ok (map-set proposals { proposal-id: proposal-id } proposal))
  )
)

(define-public (vote (proposal-id uint) (vote-for bool))
  (let (
    (proposal (unwrap! (map-get? proposals { proposal-id: proposal-id }) err-not-found))
    (voter-data { proposal-id: proposal-id, voter: tx-sender })
  )
    (asserts! (< block-height (get voting-ends-at proposal)) err-voting-closed)
    (asserts! (is-none (map-get? votes voter-data)) err-already-exists)
    (map-set votes voter-data { vote: vote-for })
    (if vote-for
      (map-set proposals { proposal-id: proposal-id }
        (merge proposal { votes-for: (+ (get votes-for proposal) u1) }))
      (map-set proposals { proposal-id: proposal-id }
        (merge proposal { votes-against: (+ (get votes-against proposal) u1) }))
    )
    (ok true)
  )
)

;; Read-only functions
(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals { proposal-id: proposal-id })
)

(define-read-only (get-vote (proposal-id uint) (voter principal))
  (map-get? votes { proposal-id: proposal-id, voter: voter })
)
