"""The farmer's priority (Soil and Today screens): what to show first among the day's tasks and the field alerts.
Urgent warnings stay on top whatever the priority; the priority orders everything else."""
PRIORITIES = ("soil", "water", "money", "fodder")

# task category / alert kind -> the priorities it serves, best first
SERVES = {
    "irrigation": ("water",), "water": ("water",), "catchup": ("water",),
    "fertilizer": ("soil", "fodder"), "spot": ("soil", "money"),
    "inspection": ("money",), "spray": ("money",), "rust": ("money",), "heat": ("money", "water"),
    "milestone": ("fodder", "money"),
}


def rank(kind: str | None, priority: str | None) -> int:
    """0 when this task/alert serves the farmer's priority first, 1 when second, 2 otherwise."""
    s = SERVES.get(kind or "", ())
    return s.index(priority) if priority in s else 2
