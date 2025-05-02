using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Backend.Entities;

[PrimaryKey(nameof(BookmarkId), nameof(BookId))]
public class BookmarkBook
{
    [ForeignKey("Bookmark")]
    public Guid BookmarkId { get; set; }
    
    [ForeignKey("Book")]
    public Guid BookId { get; set; }

    public virtual Book Book { get; set; }
    public virtual Bookmark Bookmark { get; set; }
}