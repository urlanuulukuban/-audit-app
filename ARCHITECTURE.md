# Audit Questionnaire Application - Architecture Overview

## System Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        HTML["HTML Structure"]
        CSS["Styling<br/>Dark Theme"]
        JS["JavaScript Logic"]
    end
    
    subgraph UI["User Interface Components"]
        LOGIN["Login Box<br/>Password Entry"]
        APP["Main Application<br/>Quiz Interface"]
        PROGRESS["Progress Indicator<br/>Question Counter"]
        BUTTONS["Action Buttons<br/>Yes/No/Next"]
        RESULTS["Results Display<br/>Score & Checklist"]
    end
    
    subgraph DATA["Data Layer"]
        TESTS["Test Database<br/>5 Sections × ~60 Questions"]
        STATE["Application State<br/>Current Question<br/>Score/Total<br/>Results Array"]
    end
    
    subgraph SECTIONS["Content Sections"]
        S1["Бухгалтерия<br/>100 Questions"]
        S2["Экономика<br/>60 Questions"]
        S3["Продажи<br/>30 Questions"]
        S4["Маркетинг<br/>20 Questions"]
        S5["Управление<br/>16 Questions"]
    end
    
    subgraph LOGIC["Core Logic"]
        AUTH["Authentication<br/>Password Validation"]
        QUIZ["Quiz Engine<br/>Question Navigation"]
        SCORING["Score Calculation<br/>Yes/No Tracking"]
        EXPORT["Results Processing<br/>Report Generation"]
    end
    
    Client -->|Renders| UI
    LOGIN -->|Validates| AUTH
    AUTH -->|Unlocks| APP
    APP -->|Displays| PROGRESS
    APP -->|Shows| BUTTONS
    BUTTONS -->|Trigger| QUIZ
    QUIZ -->|Retrieves| TESTS
    TESTS -->|Contains| SECTIONS
    BUTTONS -->|Updates| STATE
    STATE -->|Feeds| SCORING
    SCORING -->|Generates| RESULTS
    RESULTS -->|Displays| EXPORT
```

## Data Flow Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI as User Interface
    participant Auth as Authentication
    participant Quiz as Quiz Engine
    participant State as Application State
    participant Results as Results Manager

    User->>UI: Enter Password
    UI->>Auth: Validate Credentials
    Auth-->>UI: Password Correct
    UI->>Quiz: Initialize Quiz
    Quiz->>State: Load First Question
    State-->>Quiz: Section/Question Data
    Quiz-->>UI: Display Question

    loop For Each Question
        User->>UI: Click Yes/No/Next
        UI->>State: Record Answer
        State->>Results: Add to Results Array
        State->>State: Update Score
        State-->>Quiz: Next Question
        Quiz-->>UI: Display Next Question
    end

    loop After All Sections
        Quiz->>Results: Generate Final Report
        Results->>Results: Calculate Percentage
        Results-->>UI: Display Score & Checklist
        UI-->>User: Show Results
    end
```

## Component Structure

```mermaid
graph LR
    APP["Audit Quiz Application"]
    
    APP --> AUTH["Authentication Module<br/>- Password Check<br/>- UI Toggle"]
    APP --> CORE["Core Quiz Module<br/>- Question Loading<br/>- Navigation<br/>- State Management"]
    APP --> UI_COMP["UI Components<br/>- Progress Bar<br/>- Question Display<br/>- Action Buttons<br/>- Result View"]
    APP --> DATA_MGT["Data Management<br/>- Questions Database<br/>- Answer Tracking<br/>- Score Calculation"]
    
    style AUTH fill:#3b82f6
    style CORE fill:#22c55e
    style UI_COMP fill:#f59e0b
    style DATA_MGT fill:#8b5cf6
```

## Key Features

| Feature | Component | Purpose |
|---------|-----------|---------|
| **Authentication** | Login Box | Secure access with password |
| **Quiz Navigation** | Question Loader | Display questions one by one |
| **Progress Tracking** | Progress Bar | Show current position in quiz |
| **Answer Recording** | Buttons (Yes/No) | Capture user responses |
| **State Management** | JavaScript State | Track score, total, results |
| **Result Generation** | Results Display | Show final score & full checklist |
| **Data Storage** | Tests Object | 5 sections with ~220 total questions |

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Dark theme with color-coded buttons
- **Data Storage**: JavaScript Object (in-memory)
- **Authentication**: Simple password validation
- **Architecture**: Single-page application (SPA)

## User Journey

1. **Login** → Enter password to access the quiz
2. **Quiz** → Answer questions across 5 sections sequentially
3. **Navigation** → Move through questions with "Yes", "No", and "Next" buttons
4. **Progress** → Track position with question counter
5. **Results** → View final percentage score and complete checklist of responses
