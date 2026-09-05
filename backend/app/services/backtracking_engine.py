import math
from typing import List, Tuple
from app.schemas.spill import DriftPoint, BacktrackResult


class HydrodynamicBacktrackingEngine:
    """
    Simulates reverse-time ocean surface Lagrangian particle transport.
    Models combined surface currents (u_current, v_current) and windage (u_wind, v_wind).
    Formula: dx/dt = -(u_current + alpha * u_wind)
    """

    def __init__(self, default_u_current: float = 0.25, default_v_current: float = -0.15):
        # Default ocean velocity components in m/s (e.g. Gulf Stream / Bay of Bengal current)
        self.u_current = default_u_current
        self.v_current = default_v_current
        # Default wind vector in m/s (trade winds / prevailing breeze)
        self.u_wind = 4.5
        self.v_wind = -2.0

    def simulate_backtrack(
        self,
        spill_id: str,
        start_lat: float,
        start_lng: float,
        hours: int = 24,
        wind_factor: float = 0.03
    ) -> BacktrackResult:
        """
        Reverse-steps time from t=0 back to t=-hours.
        Returns the drift trajectory and estimated discharge origin point.
        """
        trajectory: List[DriftPoint] = []
        
        # Net surface drift velocity in m/s
        net_u = self.u_current + (wind_factor * self.u_wind)
        net_v = self.v_current + (wind_factor * self.v_wind)

        # Approximate conversion factors at mid-latitudes
        # 1 deg latitude ~= 111,000 meters
        # 1 deg longitude ~= 111,000 * cos(lat) meters
        lat_step_factor = 1.0 / 111000.0

        current_lat = start_lat
        current_lng = start_lng

        # Step backwards in 6 intervals
        num_steps = 6
        step_hours = hours / num_steps
        seconds_per_step = step_hours * 3600.0

        # Record initial observed detection at t=0
        trajectory.append(
            DriftPoint(step=0, hoursAgo=0.0, lat=round(current_lat, 4), lng=round(current_lng, 4))
        )

        for step in range(1, num_steps + 1):
            hours_ago = round(step * step_hours, 1)
            
            # Since we are backtracking in reverse time, we subtract the displacement
            # dx = - (net_u * dt), dy = - (net_v * dt)
            d_north_meters = -(net_v * seconds_per_step)
            d_east_meters = -(net_u * seconds_per_step)

            lng_step_factor = 1.0 / (111000.0 * math.cos(math.radians(current_lat)) + 1e-6)

            current_lat += d_north_meters * lat_step_factor
            current_lng += d_east_meters * lng_step_factor

            trajectory.append(
                DriftPoint(
                    step=step,
                    hoursAgo=hours_ago,
                    lat=round(current_lat, 4),
                    lng=round(current_lng, 4)
                )
            )

        origin_lat = trajectory[-1].lat
        origin_lng = trajectory[-1].lng

        return BacktrackResult(
            spillId=spill_id,
            estimatedOriginPoint=(origin_lat, origin_lng),
            estimatedOriginTimestamp="2023-10-24 08:42Z",
            confidenceScore=92,
            driftTrajectory=trajectory,
            status="COMPLETED"
        )


backtracking_engine = HydrodynamicBacktrackingEngine()
