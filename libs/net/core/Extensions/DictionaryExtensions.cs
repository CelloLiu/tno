using System.Text.Json;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Http.Internal;

namespace TNO.Core.Extensions;

/// <summary>
/// DictionaryExtensions static class, provides extension methods for dictionary objects.
/// </summary>
public static class DictionaryExtensions
{
    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an int.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static int GetIntValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, int defaultValue = 0)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && int.TryParse(dValue, out int value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an int.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static int? GetIntNullValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, int? defaultValue = null)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && int.TryParse(dValue, out int value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an array of int.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <returns></returns>
    public static int[] GetIntArrayValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues value) ? value.ToArray()
            .Select(v => { return int.TryParse(v, out int iv) ? (int?)iv : null; })
            .Where(v => v != null)
            .Select(v => (int)(v ?? default))
            .ToArray() : Array.Empty<int>();
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an long.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static long GetLongValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, long defaultValue = 0)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && long.TryParse(dValue, out long value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an long.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static long? GetLongNullValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, long? defaultValue = null)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && long.TryParse(dValue, out long value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an array of long.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <returns></returns>
    public static long[] GetLongArrayValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues value) ? value.ToArray().Where(v => !String.IsNullOrWhiteSpace(v)).Select(v => long.Parse(v!)).ToArray() : Array.Empty<long>();
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an float.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static float GetFloatValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, float defaultValue = 0)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && float.TryParse(dValue, out float value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an boolean.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static bool GetBoolValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, bool defaultValue = false)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && bool.TryParse(dValue, out bool value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an float.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <returns></returns>
    public static float? GetFloatNullValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, float? defaultValue = null)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && float.TryParse(dValue, out float value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an float.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static decimal GetDecimalValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, decimal defaultValue = 0)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && decimal.TryParse(dValue, out decimal value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an float.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static decimal? GetDecimalNullValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, decimal? defaultValue = null)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && decimal.TryParse(dValue, out decimal value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an double.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static double GetDoubleValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, double defaultValue = 0)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && double.TryParse(dValue, out double value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an double.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static double? GetDoubleNullValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, double? defaultValue = null)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && double.TryParse(dValue, out double value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an string.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static string? GetStringValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, string? defaultValue = null)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues value) ? value.ToString() : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an array of string.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <returns></returns>
    public static string[] GetStringArrayValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues value) ? value.ToArray().Where(v => !String.IsNullOrWhiteSpace(v)).Select(v => v!).ToArray() : Array.Empty<string>();
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an Guid.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static Guid GetGuidValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, Guid defaultValue = default)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && Guid.TryParse(dValue, out Guid value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an Guid.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static Guid? GetGuidNullValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, Guid? defaultValue = null)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && Guid.TryParse(dValue, out Guid value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an DateTime.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static DateTime GetDateTimeValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, DateTime defaultValue = default)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && DateTime.TryParse(dValue, out DateTime value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an DateTime.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static DateTime? GetDateTimeNullValue(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, DateTime? defaultValue = null)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && DateTime.TryParse(dValue, out DateTime value) ? value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an Enum of type 'T'.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="ignoreCase"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static T? GetEnumValue<T>(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, bool ignoreCase = true, T? defaultValue = default)
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && Enum.TryParse(typeof(T), dValue, ignoreCase, out object? value) ? (T?)value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as an Enum of type 'T'.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="ignoreCase"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static T? GetEnumNullValue<T>(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, bool ignoreCase = true, T? defaultValue = null)
        where T : struct
    {
        return dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues dValue) && Enum.TryParse(typeof(T), dValue, ignoreCase, out object? value) ? (T?)value : defaultValue;
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as the specified type 'T'.
    /// If the value doesn't convert correctly it will return a default value of the specified type 'T'.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static T? GetValue<T>(this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key, T? defaultValue = default)
    {
        var type = typeof(T);
        var nullabletype = Nullable.GetUnderlyingType(type);
        var baseType = nullabletype ?? type;
        var found = dict.TryGetValue(key, out Microsoft.Extensions.Primitives.StringValues value);

        if (!found) return defaultValue;

        try
        {
            return (T)Convert.ChangeType(value.ToString(), baseType);
        }
        catch
        {
            // Ignore exception and return default value.
            return defaultValue;
        }
    }

    /// <summary>
    /// Get the value from the dictionary for the specified 'key' and return it as a boolean.
    /// </summary>
    /// <param name="dict"></param>
    /// <param name="key"></param>
    /// <param name="defaultValue"></param>
    /// <returns></returns>
    public static bool? GetBoolNullValue(
        this IDictionary<string, Microsoft.Extensions.Primitives.StringValues> dict, string key,
        bool? defaultValue = null)
    {
        return dict.GetValue(key, defaultValue);
    }

    /// <summary>
    /// Extract the boolean value from the collection.
    /// </summary>
    /// <param name="obj"></param>
    /// <param name="key"></param>
    /// <returns></returns>
    public static bool GetBoolValue(this Dictionary<string, JsonElement> obj, string key)
    {
        if (!obj.ContainsKey(key)) return default;

        var element = obj[key];

        return element.ValueKind switch
        {
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.String => bool.Parse(element.GetString() ?? "false"),
            JsonValueKind.Null => default,
            JsonValueKind.Undefined => default,
            _ => default,
        };
    }
}
