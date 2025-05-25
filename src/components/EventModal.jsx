import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormControlLabel,
  Switch,
  Grid,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useCalendarStore from '../store/calendarStore';

const EventModal = () => {
  const {
    selectedEvent,
    selectedDate,
    modalMode,
    isEventModalOpen,
    toggleEventModal,
    addEvent,
    updateEvent,
    deleteEvent,
  } = useCalendarStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(),
    color: '#1976d2',
    isRecurring: false,
    recurrence: {
      type: 'none',
      interval: 1,
      daysOfWeek: [],
      endDate: null,
    },
  });

  const today = new Date();
  today.setHours(0,0,0,0);

  useEffect(() => {
    if (selectedEvent && modalMode === 'edit') {
      setFormData({
        ...selectedEvent,
        isRecurring: !!selectedEvent.recurrence,
      });
    } else if (modalMode === 'add') {
      const startDate = new Date(selectedDate);
      startDate.setHours(9, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(10, 0, 0, 0);

      setFormData({
        title: '',
        description: '',
        startDate: startDate,
        endDate: endDate,
        color: '#1976d2',
        isRecurring: false,
        recurrence: {
          type: 'none',
          interval: 1,
          daysOfWeek: [],
          endDate: null,
        },
      });
    }
  }, [selectedEvent, modalMode, selectedDate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (name) => (date) => {
    setFormData((prev) => ({
      ...prev,
      [name]: date,
    }));
  };

  const handleRecurrenceChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      recurrence: {
        ...prev.recurrence,
        [name]: value,
      },
    }));
  };

  const isBackDated = formData.startDate < today;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'add') {
      addEvent(formData);
    } else if (modalMode === 'edit' && selectedEvent) {
      updateEvent(selectedEvent.id, formData);
    }
    toggleEventModal();
  };

  const handleDelete = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      toggleEventModal();
    }
  };

  return (
    <Dialog open={isEventModalOpen} onClose={toggleEventModal} maxWidth="sm" fullWidth>
      <DialogTitle>
        {modalMode === 'add' ? 'Add Event' : modalMode === 'edit' ? 'Edit Event' : 'Event Details'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                disabled={modalMode === 'view'}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
                disabled={modalMode === 'view'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={handleDateChange('startDate')}
                  disabled={modalMode === 'view'}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={handleDateChange('endDate')}
                  disabled={modalMode === 'view'}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Color"
                name="color"
                type="color"
                value={formData.color}
                onChange={handleChange}
                disabled={modalMode === 'view'}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isRecurring}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isRecurring: e.target.checked,
                        recurrence: e.target.checked
                          ? { ...prev.recurrence, type: 'daily' }
                          : { type: 'none' },
                      }))
                    }
                    disabled={modalMode === 'view'}
                  />
                }
                label="Recurring Event"
              />
            </Grid>
            {formData.isRecurring && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Recurrence Type</InputLabel>
                    <Select
                      name="type"
                      value={formData.recurrence.type}
                      onChange={handleRecurrenceChange}
                      disabled={modalMode === 'view'}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                      <MenuItem value="custom">Custom</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                {formData.recurrence.type === 'custom' && (
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Interval"
                      name="interval"
                      value={formData.recurrence.interval}
                      onChange={handleRecurrenceChange}
                      disabled={modalMode === 'view'}
                    />
                  </Grid>
                )}
                {formData.recurrence.type === 'weekly' && (
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Days of Week</InputLabel>
                      <Select
                        multiple
                        name="daysOfWeek"
                        value={formData.recurrence.daysOfWeek}
                        onChange={handleRecurrenceChange}
                        disabled={modalMode === 'view'}
                      >
                        <MenuItem value={0}>Sunday</MenuItem>
                        <MenuItem value={1}>Monday</MenuItem>
                        <MenuItem value={2}>Tuesday</MenuItem>
                        <MenuItem value={3}>Wednesday</MenuItem>
                        <MenuItem value={4}>Thursday</MenuItem>
                        <MenuItem value={5}>Friday</MenuItem>
                        <MenuItem value={6}>Saturday</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                      label="End Date (Optional)"
                      value={formData.recurrence.endDate}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          recurrence: { ...prev.recurrence, endDate: date },
                        }))
                      }
                      disabled={modalMode === 'view'}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
              </>
            )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        {modalMode === 'view' && (
          <>
            <Button onClick={() => setModalMode('edit')}>Edit</Button>
            <Button onClick={handleDelete} color="error">
              Delete
            </Button>
          </>
        )}
        {modalMode !== 'view' && (
          <>
            <Button onClick={toggleEventModal}>Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isBackDated}>
              {modalMode === 'add' ? 'Add' : 'Save'}
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EventModal; 