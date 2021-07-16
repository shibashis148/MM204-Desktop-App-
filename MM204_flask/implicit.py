# programming assignment on 1-D conduction, being infinitely long in both length and breadth inside the plane of paper, the temperature could be assumed to be almost constant and not varying in those direction, but changes along the thickness length which is very small
import numpy as np


def implicit(t1, t2, exposure_time):
    h = 100  # Heat thermal Coefficient of air
    k = 0.3  # Thermal conductivity
    cp = 1500  # specific heat capacity of the material
    rho = 1200  # density of the slab's material
    dx = 6e-3  # 6 mm - length of the control volume considered, the boundary control volumes are 3 mm, half the size of inner control volume
    dt = 30  # in second as delta t must be less than 36 second comes from explicit equation conditional stability rule
    a = (2 * k * dt) / ((dx**2) * rho * cp)
    b = (2 * h * dt) / (dx * rho * cp)
    T_inf = t1
    T_all = np.zeros(11)
    T_all += t2

    for i in range(int((exposure_time * 3600) / dt)):
        A = np.zeros((11, 11))
        B = np.zeros(11)
        for i in range(11):
            if i == 0:
                A[i, i] = 1 + a
                A[i, i + 1] = -a
                B[i] = T_all[i]
            elif i == 10:
                A[i, i - 1] = -a
                A[i, i] = 1 + a + b
                B[i] = T_all[i] + b * T_inf
            else:
                A[i, i - 1] = -(a / 2)
                A[i, i] = 1 + a
                A[i, i + 1] = -(a / 2)
                B[i] = T_all[i]

        T_all = np.linalg.solve(A, B)
    return T_all[0], T_all[10]