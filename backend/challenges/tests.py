from itertools import permutations
import math

# Function to check if a string is a palindrome
def is_palindrome(s):
    return s == s[::-1]

# Function to calculate minimum swaps to convert string to palindrome
def min_swaps_to_palindrome(s):
    n = len(s)
    s = list(s)
    swaps = 0
    for i in range(n // 2):
        if s[i] != s[n - 1 - i]:
            # Find matching pair
            left = i
            right = n - 1 - i
            while right > left and s[right] != s[i]:
                right -= 1
            if right == left:
                return -1  # Impossible to form palindrome
            # Swap to bring the character to the correct position
            for j in range(right, n - 1 - i):
                s[j], s[j + 1] = s[j + 1], s[j]
                swaps += 1
    return swaps

# Function to calculate the expected number of swaps
def expected_swaps(s):
    # Set of all unique permutations of the string
    perms = set(permutations(s))
    
    # If the string is already a palindrome, return 0 swaps
    if is_palindrome(s):
        return 0.0000

    total_swaps = 0
    num_palindromes = 0
    for perm in perms:
        perm_str = ''.join(perm)
        if is_palindrome(perm_str):
            swaps_needed = min_swaps_to_palindrome(perm_str)
            if swaps_needed != -1:
                total_swaps += swaps_needed
                num_palindromes += 1

    # Calculate expected swaps
    if num_palindromes == 0:
        return 0.0000  # No palindrome can be formed
    expected_value = total_swaps / num_palindromes
    return round(expected_value, 4)

# Read number of test cases
T = int(input().strip())
for _ in range(T):
    s = input().strip()
    print(f"{expected_swaps(s):.4f}")
