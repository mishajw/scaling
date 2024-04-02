#!/usr/bin/env python3

import numpy as np

chinchilla_1_a = 0.5
chinchilla_1_b = 0.5
chinchilla_1_nd = np.array(
    [
        [400e6, 8e9],
        [1e9, 20.2e9],
        [10e9, 205.1e9],
        [67e9, 1.5e12],
        [175e9, 3.7e12],
        [280e9, 5.9e12],
        [520e9, 11e12],
        [1e12, 21.2e12],
        [10e12, 216.2e12],
    ]
)

chinchilla_2_a = 0.49
chinchilla_2_b = 0.51
chinchilla_2_nd = np.array(
    [
        [400e6, 7.7e9],
        [1e9, 20e9],
        [10e9, 219.5e9],
        [67e9, 1.7e12],
        [175e9, 4.3e12],
        [280e9, 7.1e12],
        [520e9, 13.4e12],
        [1e12, 26.5e12],
        [10e12, 292e12],
    ]
)

chinchilla_3_a = 0.46
chinchilla_3_b = 0.54
chinchilla_3_nd = np.array(
    [
        [400e6, 9.2e9],
        [1e9, 27.1e9],
        [10e9, 410.1e9],
        [67e9, 4.1e12],
        [175e9, 12e12],
        [280e9, 20.1e12],
        [520e9, 43.5e12],
        [1e12, 94.1e12],
        [10e12, 1425.5e12],
    ]
)


def estimate_coefficients(
    n: np.ndarray,
    d: np.ndarray,
    a: float,
    b: float,
) -> tuple[float, float]:
    c = n * d * 6
    return (
        (n * (c**-a)).mean(),
        (d * (c**-b)).mean(),
    )


print((10e21**kaplan_a))
print((10e21**kaplan_b))

chinchilla_1_alpha, chinchilla_1_beta = estimate_coefficients(
    chinchilla_1_nd[:, 0],
    chinchilla_1_nd[:, 1],
    chinchilla_1_a,
    chinchilla_1_b,
)
print(f"Chinchilla 1: alpha={chinchilla_1_alpha:.4f}, beta={chinchilla_1_beta:.4f}")

chinchilla_2_alpha, chinchilla_2_beta = estimate_coefficients(
    chinchilla_2_nd[:, 0],
    chinchilla_2_nd[:, 1],
    chinchilla_2_a,
    chinchilla_2_b,
)
print(f"Chinchilla 2: alpha={chinchilla_2_alpha:.4f}, beta={chinchilla_2_beta:.4f}")

chinchilla_3_alpha, chinchilla_3_beta = estimate_coefficients(
    chinchilla_3_nd[:, 0],
    chinchilla_3_nd[:, 1],
    chinchilla_3_a,
    chinchilla_3_b,
)
print(f"Chinchilla 3: alpha={chinchilla_3_alpha:.4f}, beta={chinchilla_3_beta:.4f}")
