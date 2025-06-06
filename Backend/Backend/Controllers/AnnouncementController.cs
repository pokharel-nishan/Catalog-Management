﻿using Backend.DTOs.Admin.Announcement;
using Backend.DTOs.Admin.Book;
using Backend.Entities;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnnouncementController : ControllerBase
{
    private IAnnouncementService _announcementService;
    private IUserService _userService;

    public AnnouncementController(IAnnouncementService announcementService, IUserService userService)
    {
        _announcementService = announcementService;
        _userService = userService;
    }
    
    [Authorize(Roles = "Admin")]
    [HttpGet("active")]
    public async Task<IActionResult> GetActiveAnnouncements()
    {
        var announcements = await _announcementService.GetActiveAnnouncementsAsync();
        return Ok(announcements);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("addAnnouncement")]
    //[Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddAnnouncementAsync([FromBody] AddAnnouncementDTO addAnnouncementDTO)
    {
        var adminId = await _userService.GetAdminIdAsync();

        bool isAnnouncementAdded = await _announcementService.AddAnnouncementAsync(addAnnouncementDTO, adminId);

        if (isAnnouncementAdded)
        {
            return Ok($"Success: Announcement added successfully!");
        }
        else
        {
            return BadRequest($"Error: Announcement could not be added.");
        }
    }

    [HttpGet("getAllAnnouncements")]
    public async Task<List<Announcement>> GetAllAnnouncementsAsync()
    {
        return await _announcementService.GetAllAnnouncementsAsync();
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("updateAnnouncementDetails/{announcementId}")]
    public async Task<IActionResult> UpdateAnnouncementDetailsAsync(Guid announcementId, UpdateAnnouncementDTO updateAnnouncementDTO)
    {
        bool isAnnouncementUpdated = await _announcementService.UpdateAnnouncementDetailsAsync(announcementId, updateAnnouncementDTO);

        if (isAnnouncementUpdated)
        {
            return Ok($"Success: Announcement updated successfully!");
        }
        else
        {
            return BadRequest($"Error: Announcement could not be updated.");
        }
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("deleteAnnouncement/{announcementId}")]
    public async Task<IActionResult> DeleteAnnouncementAsync(Guid announcementId)
    {
        bool isAnnouncementDeleted = await _announcementService.DeleteAnnouncementAsync(announcementId);

        if (isAnnouncementDeleted)
        {
            return Ok($"Success: Announcement deleted successfully!");
        }
        else
        {
            return BadRequest($"Error: Announcement could not be deleted.");
        }
    }
}