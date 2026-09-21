import { useCallback, useEffect, useRef, useState } from "react"

export const useRestTimer = (onFinish: () => void) => {
	const [restSecondsLeft, setRestSecondsLeft] = useState(0)
	const [isResting, setIsResting] = useState(false)
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
	const onFinishRef = useRef(onFinish)
	onFinishRef.current = onFinish

	const clearTimer = useCallback(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
			intervalRef.current = null
		}
	}, [])

	useEffect(() => clearTimer, [clearTimer])

	const finish = useCallback(() => {
		clearTimer()
		setIsResting(false)
		setRestSecondsLeft(0)
		onFinishRef.current()
	}, [clearTimer])

	const start = useCallback(
		(seconds: number) => {
			if (isResting) return

			clearTimer()
			setRestSecondsLeft(seconds)
			setIsResting(true)
			intervalRef.current = setInterval(() => {
				setRestSecondsLeft((prev) => prev - 1)
			}, 1000)
		},
		[clearTimer, isResting],
	)

	const addSeconds = useCallback((seconds: number) => {
		setRestSecondsLeft((prev) => prev + seconds)
	}, [])

	const skip = useCallback(() => {
		if (!isResting) return
		finish()
	}, [finish, isResting])

	useEffect(() => {
		if (isResting && restSecondsLeft <= 0) {
			finish()
		}
	}, [isResting, restSecondsLeft, finish])

	return { restSecondsLeft, isResting, start, addSeconds, skip }
}
