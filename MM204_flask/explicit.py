# programming assignment on 1-D conduction, being infinitely long in both length and breadth inside the plane of paper, the temperature could be assumed to be almost constant and not varying in those direction, but changes along the thickness length which is very small
import numpy as np


def explicit(T1, T2, exposure_time):
    h = 100  # Heat thermal Coefficient of air
    k = 0.3  # Thermal conductivity
    cp = 1500  # specific heat capacity of the material
    rho = 1200  # density of the slab's material
    dx = 6e-3  # 6 mm - length of the control volume considered, the boundary control volumes are 3 mm, half the size of inner control volume
    dt = 30  # in second as delta t must be less than 36 second comes from explicit equation conditional stability rule
    a = (2 * k * dt) / ((dx**2) * rho * cp)
    b = (2 * h * dt) / (dx * rho * cp)
    T_inf = T1
    T_all = np.zeros(11)
    T_all += T2
    T_bottom = [T2]
    T_top = [T2]
    Time = np.linspace(0, 3600, int((exposure_time * 3600) / dt) + 1)
    dist = np.linspace(0, 60, 11)
    for i in range(int((exposure_time * 3600) / dt)):
        T_all = [
            (1 - a - b) * T_all[10] + b * T_inf + a * T_all[8] if j == 10 else
            (1 - a) * T_all[0] + a * T_all[1] if j == 0 else
            (a / 2) * T_all[j + 1] + (1 - a) * T_all[j] +
            (a / 2) * T_all[j - 1] for j in range(11)
        ]
        T_bottom.append(T_all[0])
        T_top.append(T_all[10])
        # if i % 8 == 0:

    return T_bottom, T_top, Time
