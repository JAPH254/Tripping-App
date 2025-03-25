from django.db import models

class Trip(models.Model):
    current_location = models.CharField(max_length=255)
    pickup_location = models.CharField(max_length=255)
    dropoff_location = models.CharField(max_length=255)
    cycle_hours_used = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Trip from {self.pickup_location} to {self.dropoff_location}"

class ELDLog(models.Model):
    driver_name = models.CharField(max_length=100)
    date = models.DateField(auto_now_add=True)
    total_hours = models.DecimalField(max_digits=4, decimal_places=2)
    driving_hours = models.DecimalField(max_digits=4, decimal_places=2)
    rest_hours = models.DecimalField(max_digits=4, decimal_places=2)
    location = models.CharField(max_length=255)
    log_generated = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.driver_name} - {self.date}"
