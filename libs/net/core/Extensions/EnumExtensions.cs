using System.ComponentModel.DataAnnotations;

namespace TNO.Core.Extensions;

/// <summary>
/// EnumExtensions static class, provides extension methods for enum values.
/// </summary>
public static class EnumExtensions
{
    /// <summary>
    /// Get the Keycloak name value of the specified permission.
    /// </summary>
    /// <param name="permission"></param>
    /// <returns></returns>
    public static string? GetName<T>(this T evalue)
    {
        if (evalue == null) return null;

        var enumType = typeof(T);
        var memberInfos = enumType.GetMember(evalue.ToString() ?? "");
        var enumValueMemberInfo = memberInfos.FirstOrDefault(m => m.DeclaringType == enumType) ?? throw new InvalidOperationException("Invalid enum type");
        var attribute = (DisplayAttribute?)enumValueMemberInfo.GetCustomAttributes(typeof(DisplayAttribute), false).FirstOrDefault();
        return attribute?.Name;
    }

    /// <summary>
    /// Convert flagged enum into an array of int.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="evalue"></param>
    /// <returns></returns>
    public static int[] GetFlagValues<T>(this T evalue)
        where T : Enum
    {
        return Enum.GetValues(typeof(T))
            .Cast<T>()
            .Where(v => evalue.HasFlag(v))
            .Select(v => (int)(object)v)
            .ToArray();
    }

    /// <summary>
    /// Convert array of int into flagged enum.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="evalues"></param>
    /// <returns></returns>
    public static T ToFlagEnum<T>(this IEnumerable<int> evalues)
        where T : Enum
    {
        return (T)(object)evalues.Aggregate(0, (c, n) => c |= n);
    }

    /// <summary>
    /// Return a new enumerable by extracting all items that are null or empty or whitespace.
    /// </summary>
    /// <param name="items"></param>
    /// <returns></returns>
    public static IEnumerable<T> NotNullOrWhiteSpace<T>(this IEnumerable<T> items)
    {
        return items.Where(v => v != null && !String.IsNullOrWhiteSpace($"{v}"));
    }
}
