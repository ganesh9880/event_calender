# Interactive Event Calendar

A modern, interactive event calendar application built with React and Material-UI. This application allows users to manage their events with features like recurring events, drag-and-drop rescheduling, and event conflict management.

## Live Demo

[View Live Demo](https://ganesh9880.github.io/event_calender)

## Features

- 📅 Monthly calendar view with navigation
- ✨ Add, edit, and delete events
- 🔄 Support for recurring events (Daily, Weekly, Monthly, Custom)
- 🎯 Drag-and-drop event rescheduling
- ⚠️ Event conflict management
- 💾 Local storage persistence
- 📱 Responsive design

## Tech Stack

- React 18
- Material-UI (MUI)
- date-fns for date manipulation
- react-beautiful-dnd for drag-and-drop
- Zustand for state management
- Vite for build tooling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ganesh9880/event_calender.git
   cd calendar-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Adding Events**
   - Click on any day in the calendar to add a new event
   - Fill in the event details in the modal form
   - Choose recurrence options if needed

2. **Editing Events**
   - Click on an existing event to open the edit form
   - Modify the event details
   - Save changes

3. **Deleting Events**
   - Click on an event and use the delete button
   - Confirm deletion

4. **Rescheduling Events**
   - Drag and drop events to different days
   - The system will handle conflicts automatically

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
