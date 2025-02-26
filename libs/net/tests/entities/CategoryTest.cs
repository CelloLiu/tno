namespace TNO.Test.Entities;

using System.Diagnostics.CodeAnalysis;

[Trait("category", "unit")]
[Trait("group", "entities")]
[ExcludeFromCodeCoverage]
public class CategoryTest
{
    [Fact]
    public void Constructor1()
    {
        // Arrange
        // Act
        var item = new TNO.Entities.Category("test");

        // Assert
        Assert.Equal(0, item.Id);
        Assert.Equal("test", item.Name);
        Assert.Equal("", item.Description);
        Assert.True(item.IsEnabled);
        Assert.Equal(0, item.SortOrder);

        Assert.Equal("", item.CreatedBy);
        Assert.Equal(DateTime.MinValue, item.CreatedOn);
        Assert.Equal("", item.UpdatedBy);
        Assert.Equal(DateTime.MinValue, item.UpdatedOn);
        Assert.Equal(0, item.Version);

        Assert.Empty(item.Contents);
        Assert.Empty(item.ContentsManyToMany);
    }
}
