# Gemini Context for Tutorial Repository

This repository `tutorial` is a collection of resources, scripts, and documentation for a series of educational videos/tutorials, likely produced by the user. It is organized by "episodes" or specific technical topics.

## Directory Structure Overview

The repository is structured into project-based folders:

*   **`notebooklm/` (Episode 1):** Focuses on "NotebookLM" workflow, including prompting (5W1H), content generation, and multi-platform publishing.
*   **`02-podcast-downloader/` (Episode 2):**  A project to build a podcast downloader using Claude Skills, including Python scripts and metadata handling.
*   **`03-disk-cleaner/` (Episode 3 - Current Focus):**  Resources for a "Mac Disk Space Saver" tutorial using the "Mole" tool.
        *   `mole-cleaner/`: Contains the logic for the basic system cleaning tool.
        *   `mole-cleaner-plus/`: A detailed feature plan and future implementation for "Mole Cleaner Plus" extension (User file organization).
            *   `SKILL.md`: Documentation for the new extension.
            *   `PLAN.md`: The design document.
            *   `REVIEW.md`: Expert review and suggestions for the plan.
    *   `README.md`: Detailed outline of the tutorial video, including safety analysis of open-source tools.
*   **`software/`:**  Contains documentation and resources for software tools like ScreenFlow and Screen Studio.
*   **`.agents/`, `.gemini/`, etc.:**  Configuration directories for various AI agents and skills.

## Key Files & Context

*   **`README.md`**: The root documentation listing all tutorial episodes and their content.
*   **`03-disk-cleaner/skills/mole-cleaner/PLAN.md`**:  **CRITICAL**. A design document for extending the disk cleaner with "User File" organization features (Smart Folders, iOS backups, WeChat cache). The user is currently asking for feedback on this plan.
*   **`03-disk-cleaner/skills/mole-cleaner/SKILL.md`**: Defines the interface and usage of the current `mole_cleaner.py` script.

## Development Conventions

*   **Language:**  Primarily Python (for scripts) and Markdown (for documentation/prompts).
*   **Style:**  Tutorial-focused. Code is meant to be educational and practical.
*   **Agent Interaction:** The user uses this repo to store "Skills" (instructions/scripts) for AI agents (Claude, Gemini, etc.) to execute.
*   **Safety:**  High emphasis on safety (e.g., `dry-run` modes, white-lists, read-only analysis) when dealing with system operations like disk cleaning.

## Current Task Context

The user is currently focused on **03-disk-cleaner**. Specifically, they are designing a new feature set ("Mole Cleaner Plus") to handle user files (large files, old backups) safely, complementing the system-level cleaning of the upstream "Mole" tool.
