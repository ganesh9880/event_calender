import React from 'react';
import { Box, Paper, Typography, IconButton, Grid } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import useCalendarStore from '../store/calendarStore';
import {
  getDaysInMonth,
  getWeekDays,
  getMonthName,
  isCurrentMonth,
  isCurrentDay,
  areDatesEqual,
} from '../utils/dateUtils';

const Calendar = () => {
  const {
    events,
    selectedDate,
    setSelectedDate,
    setSelectedEvent,
    setModalMode,
    toggleEventModal,
    moveEvent,
  } = useCalendarStore();

  const handlePrevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setModalMode('add');
    toggleEventModal();
  };

  const handleEventClick = (event, e) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setModalMode('view');
    toggleEventModal();
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newDate = new Date(destination.droppableId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (newDate < today) return;
    moveEvent(draggableId, newDate);
  };

  const renderDay = (date, index) => {
    const dayEvents = events.filter((event) =>
      areDatesEqual(new Date(event.startDate), date)
    );

    return (
      <Droppable droppableId={date.toISOString()} key={date.toISOString()}>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{
              height: '100%',
              width: '100%',
              position: 'relative',
              border: '1px solid #e0e0e0',
              bgcolor: isCurrentDay(date) ? 'action.hover' : 'background.paper',
              opacity: isCurrentMonth(date, selectedDate) ? 1 : 0.5,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
            onClick={() => handleDayClick(date)}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 2,
                left: 2,
                zIndex: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: isCurrentDay(date) ? 'primary.main' : 'text.primary',
                  fontWeight: isCurrentDay(date) ? 'bold' : 'normal',
                  fontSize: '0.75rem',
                }}
              >
                {date.getDate()}
              </Typography>
            </Box>

            <Box
              sx={{
                flex: 1,
                overflow: 'auto',
                mt: 2,
                px: 0.5,
                maxHeight: 'calc(100% - 20px)',
                '&::-webkit-scrollbar': {
                  width: '2px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '2px',
                },
              }}
            >
              {dayEvents.map((event, index) => (
                <Draggable
                  key={event.id}
                  draggableId={event.id}
                  index={index}
                >
                  {(provided) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={(e) => handleEventClick(event, e)}
                      sx={{
                        p: 0.25,
                        mb: 0.25,
                        borderRadius: 0.5,
                        bgcolor: event.color || 'primary.main',
                        color: 'white',
                        fontSize: '0.65rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        '&:hover': {
                          opacity: 0.8,
                        },
                      }}
                    >
                      {event.title}
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          </Box>
        )}
      </Droppable>
    );
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 1,
        maxWidth: '100%',
        mx: 'auto',
        width: '100%',
        height: 'calc(100vh - 32px)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <IconButton size="small" onClick={handlePrevMonth}>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <Typography 
          variant="h6" 
          sx={{ 
            flex: 1, 
            textAlign: 'center',
            fontSize: '1rem'
          }}
        >
          {getMonthName(selectedDate)}
        </Typography>
        <IconButton size="small" onClick={handleNextMonth}>
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: 0,
        borderTop: '1px solid #e0e0e0',
        borderLeft: '1px solid #e0e0e0',
      }}>
        {getWeekDays().map((day) => (
          <Box
            key={day}
            sx={{
              p: 0.5,
              textAlign: 'center',
              borderRight: '1px solid #e0e0e0',
              borderBottom: '1px solid #e0e0e0',
              bgcolor: 'grey.100',
              fontWeight: 'bold',
              fontSize: '0.75rem',
            }}
          >
            {day}
          </Box>
        ))}
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0,
            flex: 1,
            borderLeft: '1px solid #e0e0e0',
            '& > *': {
              aspectRatio: '1',
              minHeight: 0,
              height: '100%',
            },
          }}
        >
          {getDaysInMonth(selectedDate).map((date, index) => (
            <Box key={date.toISOString()}>
              {renderDay(date, index)}
            </Box>
          ))}
        </Box>
      </DragDropContext>
    </Paper>
  );
};

export default Calendar; 