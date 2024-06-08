import subprocess


def initialize_migration():
    try:
        subprocess.run(
            ["./migration/initialize_migration.sh"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    except subprocess.CalledProcessError as e:
        print(f"Error during migration initialization: {e}")


def exec_migration():
    try:
        subprocess.run(
            ["./migration/exec_migration.sh"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    except subprocess.CalledProcessError as e:
        print(f"Error during migration execution: {e}")


def exec_seed():
    try:
        subprocess.run(
            ["./migration/exec_seed.sh"],
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
        )
    except subprocess.CalledProcessError as e:
        print(f"Error during seed execution: {e}")
